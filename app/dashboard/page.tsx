import { OpenAPIDesigner } from '@/components/openapi-designer';

export const metadata = {
  title: 'MCP Tool Designer',
  description: 'Visual designer for creating MCP tools from OpenAPI 3.x specifications',
};

export default function McpToolDesignerPage() {
  return <OpenAPIDesigner />;
}
