from api.common.code_def import Code
from api.common.exception import DomainException
from api.domain.project import Project
from api.storage.project_storage import ProjectStorageMgo


def test_project_save():
    storage = ProjectStorageMgo()

    p = Project(name='p3')

    p.save(storage=storage)

    print(p.id())

    p.delete(storage)


def test_project_save_repeat():
    storage = ProjectStorageMgo()

    p = Project(name='p2')
    p.save(storage)

    has_error: bool = False
    try:
        p2 = Project(name='p2')
        p2.save(storage)
    except DomainException as ex:
        assert ex.code == Code.EXIST_DATA
        has_error = True

    p.delete(storage)
    assert has_error is True
