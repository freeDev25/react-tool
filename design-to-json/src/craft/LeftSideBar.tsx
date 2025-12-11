import { useEditor } from '@craftjs/core';
import { Text } from './components/Text';
const baseSchemas = {
	"schemas": [
		{
			"title": "Container",
			"schema": {
				"type": "node",
				"nodeType": "div",
				"props": {
					"styles": {
						"padding": "16px",
						"border": "2px dashed #ccc",
						"minHeight": "50px"
					}
				},
				"children": []
			}
		},
		{
			"title": "Text",
			"placeholder": "Sample Text",
			"schema": {
				"type": "text",
				"children": [
					"Sample Text"
				]
			}
		},
	]
};

export default function LeftSidebar() {
	const { connectors } = useEditor();

	return (
		<aside className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 space-y-4">
			<h2 className="text-sm font-semibold text-gray-700">Components</h2>

			<div className="grid grid-cols-2 gap-2">
				{baseSchemas.schemas.map((item, index) => (
					<button
						key={index}
						ref={(ref: HTMLButtonElement | null) => {
							if (ref) {
								connectors.create(ref, <Text text={item.placeholder || ''} />);
							}
						}}
						className="p-3 bg-gray-50 border border-gray-200 rounded hover:bg-gray-100 flex flex-col items-center gap-2 cursor-move text-center h-full justify-center"
					>
						<span className="text-xs font-medium">{item.title}</span>
					</button>
				))}
			</div>
		</aside>
	);
}