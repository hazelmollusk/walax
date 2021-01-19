# /usr/bin/env python3
import setuptools
import json

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

with open("package.json", "r") as fh:
    jspkg = json.load(fh)
    author, email = jspkg["author"].rsplit(' ', 1)

setuptools.setup(
    name=jspkg["name"],
    version=jspkg["version"],
    author=author,
    author_email=email,
    description=jspkg["description"],
    long_description=long_description,
    long_description_content_type="text/markdown",
    url=jspkg["repository"],
    packages=setuptools.find_packages(
        where="src/py",
        include=['walax.*']
    ),
    classifiers=[
        "Programming Language :: Python :: 3",
        "Operating System :: OS Independent",
    ],
    python_requires='>=3.6',
)
