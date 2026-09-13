from orcraft import OrcraftConfigField
from test_group_endpoints.test_default_endpoint_and_package_upload.test_default_endpoint_and_package_upload import (
	TestDefaultEndpointAndPackageUpload,
	TestDefaultEndpointAndPackageUploadConfig,
)


class TestDefaultEndpointAndPackageUploadConfig(TestDefaultEndpointAndPackageUploadConfig):
	test_endpoint = OrcraftConfigField.Endpoint(default="GMG-LEGACY", label="Test Endpoint")
	maze_executable_folder = OrcraftConfigField.PackageFolder(
		default=r"C:\orcraft\Maze\bin\v3.0.0",
		label="Maze Executable Folder",
		required=True,
		layout=OrcraftConfigField.Layout.NewRow,
	)


class TestDefaultEndpointAndPackageUpload(TestDefaultEndpointAndPackageUpload):
	def __init__(self, config: TestDefaultEndpointAndPackageUploadConfig | None = None) -> None:
		super().__init__(config or TestDefaultEndpointAndPackageUploadConfig())
