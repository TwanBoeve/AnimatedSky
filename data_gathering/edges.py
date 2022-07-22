import glob
import json

cultures = glob.glob("./*")

for i in range(len(cultures)):
    cultures[i] = cultures[i][2:]

with open("edges.json", "w", encoding="utf-8") as result:
    cultures_arr = {}
    for culture in cultures:
        try:
            idx_file = json.loads(open(culture + "/index.json", encoding="utf-8").read())
        except FileNotFoundError:
            # Since all files are read instead of only the culture folders, we need to bypass some
            continue

        constellations_arr = []

        for constellation in idx_file["constellations"]:
            lines_arr = []
            try:
                for line_array in constellation["lines"]:
                    weight = ""
                    array = line_array
                    # Check if a weight is given
                    if type(line_array[0]) == str:
                        weight = line_array[0]
                        array = array[1:]

                    for i in range(len(array)):
                        if i + 1 < len(array):
                            lines_arr.append({
                                'from': str(array[i]),
                                'to': str(array[i + 1]),
                                'weight': weight
                            })

                constellations_arr.append({
                    'id': constellation["id"],
                    'label': constellation["common_name"]["english"],
                    'edges': lines_arr})
            # Occasionally a KeyError would be thrown, but by bypassing it no data is lost
            except KeyError:
                continue

        cultures_arr.update({culture: constellations_arr})
    json.dump(cultures_arr, result, indent=2)
