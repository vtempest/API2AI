import type {
  OpenAPISpec,
  PathItemObject,
  OperationObject,
  TagObject,
  SchemaObject,
  ReferenceObject,
} from './types';

/**
 * Deep clone an object using JSON serialization
 */
export function clone<T>(obj: T): T {
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch (ex) {
    console.error('Clone error:', ex);
    return obj;
  }
}

/**
 * Filter out duplicate values from an array
 */
export function onlyUnique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index;
}

/**
 * Generate a unique ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * Sanitize path for use as HTML id
 */
export function sanitizePath(path: string): string {
  return path.replace(/[/{}]/g, '');
}

/**
 * Pre-process an OpenAPI definition to ensure all required properties exist
 */
export function preProcessDefinition(openapi: Partial<OpenAPISpec>): OpenAPISpec {
  const spec = openapi as OpenAPISpec;

  // Initialize tags external docs
  if (spec.tags) {
    for (const tag of spec.tags) {
      if (!tag.externalDocs) {
        tag.externalDocs = {};
      }
    }
  }

  // Initialize info
  if (!spec.info) {
    spec.info = { version: '1.0.0', title: 'Untitled' };
  }
  if (!spec.info.contact) {
    spec.info.contact = {};
  }
  if (!spec.info.license) {
    spec.info.license = {};
  }

  // Initialize external docs
  if (!spec.externalDocs) {
    spec.externalDocs = {};
  }

  // Initialize security
  if (!spec.security) {
    spec.security = [];
  }

  // Initialize servers
  if (!spec.servers) {
    spec.servers = [];
  }

  // Initialize paths
  if (!spec.paths) {
    spec.paths = {};
  }

  // Initialize components
  if (!spec.components) {
    spec.components = {};
  }
  if (!spec.components.links) {
    spec.components.links = {};
  }
  if (!spec.components.callbacks) {
    spec.components.callbacks = {};
  }
  if (!spec.components.schemas) {
    spec.components.schemas = {};
  }
  if (!spec.components.securitySchemes) {
    spec.components.securitySchemes = {};
  }

  // Process paths and operations
  for (const pathKey in spec.paths) {
    const path = spec.paths[pathKey];
    const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'] as const;

    for (const method of methods) {
      const op = path[method] as OperationObject | undefined;
      if (op) {
        if (!op.tags) op.tags = [];
        if (!op.parameters) op.parameters = [];
        if (!op.externalDocs) op.externalDocs = {};

        // Merge path-level parameters into operation
        if (path.parameters && path.parameters.length > 0) {
          for (const shared of path.parameters) {
            const seen = op.parameters.some(
              (child) => child && child.name === shared.name && child.in === shared.in
            );
            if (!seen) {
              op.parameters.push(shared);
            }
          }
        }
      }
    }
    // Remove path-level parameters after merging
    delete path.parameters;
  }

  // Ensure openapi version
  if (!spec.openapi) {
    spec.openapi = '3.0.3';
  }

  return spec;
}

/**
 * Post-process a path item to clean up empty properties
 */
function postProcessPathItem(pathItem: PathItemObject): PathItemObject {
  const methods = ['get', 'post', 'put', 'patch', 'delete', 'options', 'head', 'trace'] as const;

  for (const method of methods) {
    const op = pathItem[method] as OperationObject | undefined;
    if (op) {
      // Remove empty externalDocs
      if (op.externalDocs && !op.externalDocs.url) {
        delete op.externalDocs;
      }

      // Remove empty or deduplicate tags
      if (op.tags) {
        if (op.tags.length === 0) {
          delete op.tags;
        } else {
          op.tags = op.tags.filter(onlyUnique);
        }
      }

      // Process callbacks recursively
      if (op.callbacks) {
        for (const callbackKey in op.callbacks) {
          const callback = op.callbacks[callbackKey];
          for (const expKey in callback) {
            postProcessPathItem(callback[expKey]);
          }
        }
      }
    }
  }

  return pathItem;
}

/**
 * Post-process an OpenAPI definition to clean up empty properties before export
 */
export function postProcessDefinition(openapi: OpenAPISpec): OpenAPISpec {
  const def = clone(openapi);

  // Process all paths
  for (const pathKey in def.paths) {
    postProcessPathItem(def.paths[pathKey]);
  }

  // Clean up tags external docs
  if (def.tags) {
    for (const tag of def.tags) {
      if (tag.externalDocs && !tag.externalDocs.url) {
        delete tag.externalDocs;
      }
    }
  }

  // Clean up root external docs
  if (def.externalDocs && !def.externalDocs.url) {
    delete def.externalDocs;
  }

  // Clean up empty license
  if (def.info?.license && !def.info.license.name) {
    delete def.info.license;
  }

  // Clean up empty contact
  if (def.info?.contact) {
    const contact = def.info.contact;
    if (!contact.name && !contact.email && !contact.url) {
      delete def.info.contact;
    }
  }

  // Clean up empty arrays
  if (def.security?.length === 0) {
    delete def.security;
  }
  if (def.servers?.length === 0) {
    delete def.servers;
  }
  if (def.tags?.length === 0) {
    delete def.tags;
  }

  // Clean up empty components
  if (def.components) {
    if (Object.keys(def.components.schemas || {}).length === 0) {
      delete def.components.schemas;
    }
    if (Object.keys(def.components.securitySchemes || {}).length === 0) {
      delete def.components.securitySchemes;
    }
    if (Object.keys(def.components.links || {}).length === 0) {
      delete def.components.links;
    }
    if (Object.keys(def.components.callbacks || {}).length === 0) {
      delete def.components.callbacks;
    }
    if (Object.keys(def.components).length === 0) {
      delete def.components;
    }
  }

  return def;
}

/**
 * Resolve a JSON pointer reference
 */
export function resolveRef<T>(
  ref: string,
  root: OpenAPISpec
): T | undefined {
  try {
    const pointer = ref.startsWith('#') ? ref.substring(1) : ref;
    const parts = pointer.split('/').filter(Boolean);
    let current: unknown = root;

    for (const part of parts) {
      const decoded = decodeURIComponent(part.replace(/~1/g, '/').replace(/~0/g, '~'));
      if (current && typeof current === 'object' && decoded in current) {
        current = (current as Record<string, unknown>)[decoded];
      } else {
        return undefined;
      }
    }

    return current as T;
  } catch (error) {
    console.error('Error resolving $ref:', ref, error);
    return undefined;
  }
}

/**
 * Dereference an object by resolving all $ref properties
 */
export function deref<T extends object>(
  obj: T | ReferenceObject,
  defs: OpenAPISpec,
  shallow = false
): T {
  const result = clone(obj);
  const visited = new Set<string>();

  function process(current: unknown, path: string): unknown {
    if (!current || typeof current !== 'object') {
      return current;
    }

    if (Array.isArray(current)) {
      return current.map((item, index) => process(item, `${path}[${index}]`));
    }

    const record = current as Record<string, unknown>;

    if ('$ref' in record && typeof record.$ref === 'string') {
      const ref = record.$ref;
      if (visited.has(ref)) {
        return current; // Circular reference
      }
      visited.add(ref);

      const resolved = resolveRef<object>(ref, defs);
      if (resolved) {
        const derefed = shallow ? resolved : process(resolved, ref);
        // Merge resolved properties, excluding $ref
        const { $ref, ...rest } = record;
        return { ...(derefed as object), ...rest };
      }
    }

    const processed: Record<string, unknown> = {};
    for (const key in record) {
      processed[key] = process(record[key], `${path}/${key}`);
    }
    return processed;
  }

  return process(result, '#') as T;
}

/**
 * Create a default empty OpenAPI spec
 */
export function createEmptySpec(): OpenAPISpec {
  return preProcessDefinition({
    openapi: '3.0.3',
    info: {
      title: 'New API',
      version: '1.0.0',
      description: '',
    },
    paths: {},
  });
}

/**
 * Create a default operation
 */
export function createDefaultOperation(): OperationObject {
  return {
    summary: '',
    description: '',
    operationId: '',
    parameters: [],
    responses: {
      '200': {
        description: 'Successful response',
      },
    },
    tags: [],
    externalDocs: {},
  };
}

/**
 * Create a default parameter
 */
export function createDefaultParameter() {
  return {
    name: 'newParam',
    in: 'query' as const,
    required: false,
    schema: {
      type: 'string' as const,
    },
  };
}

/**
 * Create a default response
 */
export function createDefaultResponse() {
  return {
    description: 'Response description',
  };
}

/**
 * Create a default request body
 */
export function createDefaultRequestBody() {
  return {
    required: false,
    content: {
      'application/json': {
        schema: {},
      },
    },
  };
}

/**
 * Create a default server
 */
export function createDefaultServer() {
  return {
    url: 'https://api.example.com',
    description: '',
  };
}

/**
 * Create a default tag
 */
export function createDefaultTag(): TagObject {
  return {
    name: 'newTag',
    description: '',
    externalDocs: {},
  };
}

/**
 * Create a default security scheme
 */
export function createDefaultSecurityScheme() {
  return {
    type: 'apiKey' as const,
    name: 'api_key',
    in: 'query' as const,
  };
}

/**
 * Convert OpenAPI spec to YAML string
 */
export async function toYaml(spec: OpenAPISpec): Promise<string> {
  const yaml = await import('js-yaml');
  return yaml.dump(postProcessDefinition(spec), {
    indent: 2,
    lineWidth: -1,
    noRefs: true,
    sortKeys: false,
  });
}

/**
 * Convert OpenAPI spec to JSON string
 */
export function toJson(spec: OpenAPISpec): string {
  return JSON.stringify(postProcessDefinition(spec), null, 2);
}

/**
 * Parse YAML or JSON string to OpenAPI spec
 */
export async function parseSpec(input: string): Promise<OpenAPISpec> {
  let spec: OpenAPISpec;

  try {
    // Try JSON first
    spec = JSON.parse(input);
  } catch {
    // Try YAML
    const yaml = await import('js-yaml');
    spec = yaml.load(input) as OpenAPISpec;
  }

  return preProcessDefinition(spec);
}

/**
 * Validate that a spec is OpenAPI 3.x
 */
export function isValidOpenAPI3(spec: unknown): spec is OpenAPISpec {
  if (!spec || typeof spec !== 'object') return false;
  const s = spec as Record<string, unknown>;
  return typeof s.openapi === 'string' && s.openapi.startsWith('3.');
}

/**
 * Download content as a file
 */
export function downloadFile(content: string, filename: string, mimeType: string): void {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<void> {
  await navigator.clipboard.writeText(text);
}
