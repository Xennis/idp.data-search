format:
	black --target-version py38 --line-length 132 *.py

check: format-check type-check

format-check:
	black --check --target-version py39 --line-length 132 *.py

type-check:
	mypy .
