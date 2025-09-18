import os.path
from typing import Any, Optional
import epidoc


csv_fieldnames = [
    "tm",
    "title",
    "terms",
    "material",
    "commentary",
    "mainLang",
    "foreignLang",
    "originDatesWhen",
    "originDatesNotbefore",
    "originDatesNotafter",
    "originPlaces",
    "provenancesComposed",
    "provenancesLocated",
    "provenancesFound",
    # Information about the source of this entry
    "sourceFiles",
    "sourceAuthority",
    "sourceAvailability",
]


def create_list(elements, field: str) -> Optional[list[Any]]:
    if not elements:
        return None
    result = []
    for elem in elements:
        if not elem:
            continue
        value = elem.get(field)
        if not value:
            continue
        result.append(value)
    if not result:
        return None
    return result


def merge_single(result: dict[str, Any], field: str, value: Optional[Any]) -> None:
    if value is None or (isinstance(value, dict) and not value):  # None or empty dict
        return

    current: Optional[list[Any]] = result.get(field)
    if current is None:
        result[field] = [value]
        return

    if value in current:
        return  # duplicate

    current.append(value)


def merge_list(result: dict[str, Any], field: str, values: Optional[list[Any]]) -> None:
    if values is None or not values:  # Nore or empty list
        return

    assert isinstance(values, list), "values should be a list"  # Avoid function is called with a (iterable) string
    values_without_none = [x for x in values if x is not None]  # Remove `None`s

    current: Optional[list[Any]] = result.get(field)
    if current is None:
        # Currently we do not check if `values` has duplicates
        result[field] = values_without_none
        return

    assert isinstance(current, list), "current should be a list"

    for value in values_without_none:
        assert value is not None, "value should not be none"
        if value in current:
            continue  # duplicate

        current.append(value)


def convert(tm: str, files: list[str], idp_data_repo: str) -> dict[str, Any]:
    result = {
        "tm": tm,
        "sourceFiles": files,
    }
    for file in files:

        filepath = os.path.join(idp_data_repo, file)
        with open(filepath) as f:
            doc = epidoc.load(f)

        if len(doc.reprint_in) > 0:
            continue

        if file.startswith("APD"):
            pass
        elif file.startswith("APIS"):
            pass
        elif file.startswith("DCLP"):
            # url: f"http://papyri.info/dclp/{tm}"
            merge_list(result, "terms", [term.get("text") for term in doc.terms])
            merge_single(result, "title", doc.title)
            merge_single(result, "material", doc.material)
            merge_list(result, "originDatesWhen", create_list(doc.origin_dates, "when"))
            merge_list(result, "originDatesNotbefore", create_list(doc.origin_dates, "notbefore"))
            merge_list(result, "originDatesNotafter", create_list(doc.origin_dates, "notafter"))
            merge_single(result, "originPlaces", doc.origin_place.get("text"))
            merge_list(result, "provenancesComposed", create_list(doc.provenances.get("composed"), "text"))
            merge_list(result, "provenancesLocated", create_list(doc.provenances.get("located"), "text"))
            merge_list(result, "provenancesFound", create_list(doc.provenances.get("found"), "text"))
            merge_single(result, "sourceAuthority", doc.authority)
            merge_single(result, "sourceAvailability", doc.availability)
        elif file.startswith("DDB_EpiDoc_XML"):
            # url: f"http://papyri.info/ddbdp/{ddb_hybrid}" with `ddb_hybrid = doc.idno.get("ddb-hybrid")`

            # lang_usage = list(doc.languages.keys())
            # if 'en' in lang_usage:
            #     lang_usage.remove('en')
            # result['langUsage'] = lang_usage
            merge_single(result, "mainLang", doc.edition_language)
            merge_single(result, "foreignLang", doc.edition_foreign_languages)
            merge_single(result, "sourceAuthority", doc.authority)
            merge_single(result, "sourceAvailability", doc.availability)
        elif file.startswith("HGV_meta_EpiDoc"):
            # url: f"http://papyri.info/hgv/{tm}"
            merge_list(result, "terms", [term.get("text") for term in doc.terms])
            merge_single(result, "title", doc.title)
            merge_single(result, "commentary", doc.commentary)
            merge_single(result, "material", doc.material)
            merge_list(result, "originDatesWhen", create_list(doc.origin_dates, "when"))
            merge_list(result, "originDatesNotbefore", create_list(doc.origin_dates, "notbefore"))
            merge_list(result, "originDatesNotafter", create_list(doc.origin_dates, "notafter"))
            merge_single(result, "originPlaces", doc.origin_place.get("text"))
            merge_list(result, "provenancesComposed", create_list(doc.provenances.get("composed"), "text"))
            merge_list(result, "provenancesLocated", create_list(doc.provenances.get("located"), "text"))
            merge_list(result, "provenancesFound", create_list(doc.provenances.get("found"), "text"))
            merge_single(result, "sourceAuthority", doc.authority)
            merge_single(result, "sourceAvailability", doc.availability)
        elif file.startswith("HGV_trans_EpiDoc"):
            pass

    return result
