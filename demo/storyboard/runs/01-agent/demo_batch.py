from orcraft import (
	OrcraftBatchItem,
	OrcraftConfigField,
	OrcraftTestBatch,
	OrcraftTestBatchConfig,
)


class LegacyEndpointBatchConfig(OrcraftTestBatchConfig):
	name = OrcraftConfigField.Text(default="Endpoint upload on GMG-LEGACY")
	items = OrcraftConfigField.Items(default_factory=lambda: [
		OrcraftBatchItem(
			name="Test: Default Endpoint and Package Upload",
			kind="test",
			source_path="run_default_endpoint.py",
			class_name="TestDefaultEndpointAndPackageUpload",
			import_roots=(".", "../orcraft-test-suite-tutorial"),
			package_source_path="../orcraft-test-suite-tutorial",
		),
	])


class LegacyEndpointBatch(OrcraftTestBatch):
	def __init__(self) -> None:
		super().__init__(config=LegacyEndpointBatchConfig())


if __name__ == "__main__":
	LegacyEndpointBatch().run()
