import typer

from PyHackMD import API
from pprint import pprint

app = typer.Typer()

HACKMD_API_TOKEN = '2JUTC8CKVI01X1CMKYI2FSQ6LFDGXJZBVOX40ROSK6YOFC34KW'


@app.command()
def li():
    api = API(HACKMD_API_TOKEN)
    data = api.get_note_list()
    pprint(data)


@app.command()
def up(node_id: str = 'CFD9wOLJQ06RqQtfOmtKqw', md_file: str = 'openapi.md'):
    api = API(HACKMD_API_TOKEN)
    with open(md_file, 'r') as f:
        content = f.read()
        api.update_note(note_id=node_id, content=content)


if __name__ == "__main__":
    app()
