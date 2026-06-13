import urllib.request
from html.parser import HTMLParser

class TextExtractor(HTMLParser):
    def __init__(self):
        super().__init__()
        self.text = []
        self.in_body = False
        self.ignore_tags = {'script', 'style', 'nav', 'header', 'footer', 'noscript'}
        self.ignore_level = 0

    def handle_starttag(self, tag, attrs):
        if tag == 'body':
            self.in_body = True
        if tag in self.ignore_tags:
            self.ignore_level += 1

    def handle_endtag(self, tag):
        if tag == 'body':
            self.in_body = False
        if tag in self.ignore_tags:
            self.ignore_level -= 1

    def handle_data(self, data):
        if self.in_body and self.ignore_level == 0:
            d = data.strip()
            if d:
                self.text.append(d)

urls = [
    "https://ventureboreholes.com/services/blasthole-drilling/",
    "https://ventureboreholes.com/services/borehole-drilling/",
    "https://ventureboreholes.com/services/construction-support/"
]

output = {}

for url in urls:
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    try:
        html = urllib.request.urlopen(req).read().decode('utf-8')
        parser = TextExtractor()
        parser.feed(html)
        output[url] = "\n".join(parser.text)
    except Exception as e:
        output[url] = str(e)

with open('scraped_content2.txt', 'w') as f:
    for url, content in output.items():
        f.write(f"\n\n{'='*50}\nURL: {url}\n{'='*50}\n")
        f.write(content)

print("Scraped to scraped_content2.txt")
