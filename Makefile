format:
	black --target-version py38 --line-length 132 *.py

typing:
	mypy .
