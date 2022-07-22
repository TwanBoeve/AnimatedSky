import json
import urllib.request

from bs4 import BeautifulSoup
from markdown import markdown

with open("Complete_with_magnitude.csv") as stars:
    with open("nodes.json", "w", encoding="utf-8") as result:
        stars_arr = {}
        for star in stars:
            star_arr = star.split(",")
            if star_arr[0] == 'hip':
                continue

            hip = star_arr[0]
            label = star_arr[1]

            if label == '':
                try:
                    url = "https://simbad.u-strasbg.fr/simbad/sim-basic?Ident=HIP+" + hip
                    # Open the page of the star with the given HIP
                    file = urllib.request.urlopen(url)

                    encoding = file.headers.get_content_charset('utf-8')
                    # This line filters the node name out of the entire web page
                    # Since there was no apparent other solution, this was the only way to do it
                    label = ''.join(BeautifulSoup(markdown(file.read().decode(encoding))).findAll(text=True)).split(
                        'Basic data :')[1].strip().split(' -- ')[0].split('\n')[0]
                    if '* ' in label[:2]:
                        label = label[1:].strip()
                except IndexError:
                    # When a page does not exist for a certain HIP, data needs to be added manually
                    print('Page not found for HIP ', star_arr[0])

            # The x-coordinate is calculated from the Right Ascension of a node
            longitude = float(star_arr[2])

            x = 10000 - int(longitude / 24 * 10000)

            # The y-coordinate is calculated from the declination of a node
            y = 10000 - int((float(star_arr[3]) + 90) / 180 * 10000)

            magnitude = int(float(star_arr[4]) / 13.77 * 100)

            stars_arr.update({
                hip: {
                    'label': label,
                    'x': x,
                    'y': y,
                    'magnitude': magnitude
                }
            })

        json.dump(stars_arr, result, indent=2)
