import glob
import re

files = glob.glob('*.html')

# We'll update the svc-list in all files
svc_list_replacement = """                    <a href="service-consultancy.html" class="svc-row group" data-index="4" style="text-decoration:none; color:inherit;">
                        <h2 class="svc-title">Consultancy & Dev</h2>
                        <p class="svc-cat">Business Growth</p>
                    </a>
                    <a href="service-it.html" class="svc-row group" data-index="5" style="text-decoration:none; color:inherit; border-bottom: 1px solid rgba(255,255,255,0.1);">
                        <h2 class="svc-title">IT Projects</h2>
                        <p class="svc-cat">Tech Solutions</p>
                    </a>"""

svc_slider_replacement = """                    <div class="svc-slider">
                        <div class="svc-slide" style="background: var(--ink)"><img src="img/drill_front.png" alt="Borehole Drilling"></div>
                        <div class="svc-slide" style="background: var(--ink)"><img src="img/drill_front.png" alt="Blasthole Drilling"></div>
                        <div class="svc-slide" style="background: var(--charcoal)"><img src="img/water_front.png" alt="Construction Support"></div>
                        <div class="svc-slide" style="background: var(--pearl)"><img src="img/acc_front.png" alt="Exploration"></div>
                        <div class="svc-slide" style="background: var(--pearl)"><img src="img/acc_front.png" alt="Consultancy"></div>
                        <div class="svc-slide" style="background: #222"><img src="img/it_front.png" alt="IT Projects"></div>
                    </div>"""

for filepath in files:
    if filepath in ['index.html', 'about.html']: continue # Already did
    with open(filepath, 'r') as f:
        content = f.read()

    # Update svc-list
    content = re.sub(
        r'<a href="service-consultancy\.html".*?</a>',
        svc_list_replacement,
        content,
        flags=re.DOTALL
    )

    # Update svc-slider
    content = re.sub(
        r'<div class="svc-slider">.*?</div>\s*</div>\s*<div class="svc-cursor-label">',
        svc_slider_replacement + '\n                </div>\n                <div class="svc-cursor-label">',
        content,
        flags=re.DOTALL
    )

    with open(filepath, 'w') as f:
        f.write(content)

print("Updated all files with IT Projects in services list!")
