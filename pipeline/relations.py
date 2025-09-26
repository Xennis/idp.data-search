import json
import os.path
from typing import Any, Optional, TypeVar

V = TypeVar("V")


def sort_dict_by_keys(value: dict[str, V]) -> dict[str, V]:
    return {k: value[k] for k in sorted(value)}


def append_cache(cache: dict[str, list[V]], tm: V, values: Optional[list[str]]) -> None:
    if not values:
        return

    assert isinstance(values, list), "values should be a list"

    for value in values:
        assert value is not None, "value should not be None"  # Merge step should ensure this. Avoid trouble when sorting dict.

        if value not in cache:
            cache[value] = [tm]
            continue

        cache[value].append(tm)


def write_relation_file(filename: str, entries: dict[str, list[V]]) -> None:
    result = []
    for value, tms in sort_dict_by_keys(entries).items():
        result.append({"value": value, "tmCount": len(tms)})

    with open(filename, "w") as terms_f:
        terms_f.write(json.dumps(result, separators=(",", ":")))


def relations(output_dir: str) -> None:
    terms_cache: dict[str, list[Any]] = {}
    materials_cache: dict[str, list[Any]] = {}
    main_langs_cache: dict[str, list[Any]] = {}

    with open(os.path.join(output_dir, "ipd-data-sheet.json")) as data_r:
        entries = json.load(data_r)
        for entry in entries:

            tm: str = entry["tm"]
            assert isinstance(tm, str), "tm should be a string"

            append_cache(terms_cache, tm=tm, values=entry.get("terms"))
            append_cache(materials_cache, tm=tm, values=entry.get("material"))
            append_cache(main_langs_cache, tm=tm, values=entry.get("mainLang"))

    write_relation_file(os.path.join(output_dir, "terms.json"), terms_cache)
    write_relation_file(os.path.join(output_dir, "materials.json"), materials_cache)
    write_relation_file(os.path.join(output_dir, "mainLangs.json"), main_langs_cache)
