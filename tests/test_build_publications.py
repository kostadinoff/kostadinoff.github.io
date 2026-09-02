import importlib.util
import unittest
from pathlib import Path


SCRIPT = Path(__file__).resolve().parents[1] / "scripts" / "build_publications.py"
SPEC = importlib.util.spec_from_file_location("build_publications", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(MODULE)


class PublicationRenderingTests(unittest.TestCase):
    def test_group_author_and_cv_contribution_are_rendered_transparently(self):
        entry = {
            "type": "article",
            "author": "Lip, Gregory Y.H. and AFFIRMO Study Investigators and Consortium",
            "title": "AFFIRMO trial",
            "journal": "The Lancet Regional Health - Europe",
            "year": "2026",
            "pages": "101832",
            "doi": "10.1016/j.lanepe.2026.101832",
            "cv_contribution": "Group authorship: Kostadin Kostadinov (AFFIRMO Study Investigator and Consortium collaborator)",
        }

        rendered = MODULE.render(entry, 1)

        self.assertIn("Lip GYH, AFFIRMO Study Investigators and Consortium.", rendered)
        self.assertIn(
            "**Group authorship: Kostadin Kostadinov (AFFIRMO Study Investigator and Consortium collaborator).**",
            rendered,
        )


if __name__ == "__main__":
    unittest.main()
