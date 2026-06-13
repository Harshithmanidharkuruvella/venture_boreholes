import shutil
import re

# 1. Create service-it.html
shutil.copy('service-borehole.html', 'service-it.html')

pages = {
    'service-borehole.html': {
        'h1': 'Borehole<br><em>Drilling</em>',
        'desc': 'Depths up to 500m for diverse geological conditions.',
        'content': 'Utilizing state-of-the-art, high-pressure hydraulic rigs, Venture Drilling provides customized drilling solutions to reach depths of up to 500 meters, regardless of challenging geological conditions. Our drilling services cover everything from residential and commercial borehole installation to larger-scale community projects. Each project is executed with precision, ensuring a safe and reliable water source tailored to our clients’ unique environmental and operational requirements.'
    },
    'service-blasthole.html': {
        'h1': 'Blasthole<br><em>Drilling</em>',
        'desc': 'Effective rock drilling and explosive placement for mining.',
        'content': 'Our blasthole drilling services support mining operations by facilitating effective rock drilling and explosive placement for mining preparations. We use modern, high-efficiency equipment to maximize productivity while maintaining the highest safety standards in challenging mining environments.'
    },
    'service-construction.html': {
        'h1': 'Construction<br><em>Support</em>',
        'desc': 'Pumps, reservoirs, and small irrigation systems.',
        'content': 'Venture Drilling provides comprehensive support for borehole-related infrastructure, including the supply and installation of high-quality pumps, reservoirs, and small irrigation systems. We ensure that each project is fully equipped to serve its intended purpose. Our construction support services extend to community training, equipping local teams with the knowledge needed to manage and maintain their water infrastructure effectively, enhancing project sustainability and community impact.'
    },
    'service-exploration.html': {
        'h1': 'Geophysical<br><em>Surveys</em>',
        'desc': 'Advanced exploration for optimal borehole placement.',
        'content': 'We employ advanced geophysical survey techniques to accurately map subterranean water resources. Our scientific approach ensures optimal borehole placement, reducing drilling risks and maximizing yield. Whether for a small residential well or a large agricultural project, our surveys provide the critical data needed for successful drilling operations.'
    },
    'service-consultancy.html': {
        'h1': 'Consultancy<br><em>& Dev</em>',
        'desc': 'Expert guidance for business growth in the water sector.',
        'content': 'Our consultancy services provide expert guidance on water infrastructure projects, from initial feasibility studies to project management and business development. We help organizations, NGOs, and mining companies optimize their water strategies, ensuring sustainable and economically viable solutions tailored to their specific needs.'
    },
    'service-it.html': {
        'h1': 'IT<br><em>Projects</em>',
        'desc': 'Tech solutions and smart telemetry for water systems.',
        'content': 'Modern water infrastructure demands smart technology. Our IT Projects division specializes in implementing advanced telemetry and monitoring systems for boreholes and reservoirs. We provide real-time data on water levels, pump performance, and system health, empowering you to manage resources efficiently and prevent costly downtime.'
    }
}

for filepath, data in pages.items():
    with open(filepath, 'r') as f:
        content = f.read()

    # Update H1
    content = re.sub(r'<h1>.*?</h1>', f'<h1>{data["h1"]}</h1>', content, count=1, flags=re.DOTALL)
    
    # Update hero description
    content = re.sub(r'<p class="hero-desc">.*?</p>', f'<p class="hero-desc">\n                {data["desc"]}\n            </p>', content, count=1, flags=re.DOTALL)
    
    # Update main content paragraph
    # It usually resides in <div class="sec-sub">...</div> inside the About section that was copied.
    # Since the previous agent just copied index.html, we look for the sec-sub inside the #about section or the first sec-sub after the hero.
    content = re.sub(r'<div class="about-body reveal d2">.*?<div class="sec-sub">.*?</div>', f'<div class="about-body reveal d2">\n                    <p class="sec-label">Service Overview</p>\n                    <h2 class="sec-heading">Expert <em>Solutions</em></h2>\n                    <div class="sec-sub">\n                        <p>{data["content"]}</p>\n                    </div>', content, count=1, flags=re.DOTALL)

    with open(filepath, 'w') as f:
        f.write(content)

print("Updated all service pages!")
