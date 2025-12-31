"use client";

import React, { useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  Download,
  Upload,
  FileJson,
  FileText,
  Code2,
  Settings,
  Info,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronRight,
  Save,
  Eye,
  Edit3,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface Parameter {
  name: string;
  in: "query" | "header" | "path" | "cookie";
  description: string;
  required: boolean;
  schema: {
    type: string;
  };
}

interface Response {
  code: string;
  description: string;
  contentType: string;
}

interface Endpoint {
  id: string;
  path: string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  summary: string;
  description: string;
  parameters: Parameter[];
  responses: Response[];
  tags: string[];
}

interface OpenAPISpec {
  info: {
    title: string;
    version: string;
    description: string;
  };
  servers: Array<{
    url: string;
    description: string;
  }>;
  endpoints: Endpoint[];
}

export function OpenAPIDesigner() {
  const [spec, setSpec] = useState<OpenAPISpec>({
    info: {
      title: "My API",
      version: "1.0.0",
      description: "API description",
    },
    servers: [
      {
        url: "https://api.example.com",
        description: "Production server",
      },
    ],
    endpoints: [],
  });

  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"editor" | "preview">("editor");
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({
    info: true,
    servers: true,
    endpoints: true,
  });

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const addEndpoint = () => {
    const newEndpoint: Endpoint = {
      id: `endpoint-${Date.now()}`,
      path: "/new-endpoint",
      method: "GET",
      summary: "New endpoint",
      description: "",
      parameters: [],
      responses: [
        {
          code: "200",
          description: "Successful response",
          contentType: "application/json",
        },
      ],
      tags: [],
    };
    setSpec((prev) => ({
      ...prev,
      endpoints: [...prev.endpoints, newEndpoint],
    }));
    setSelectedEndpoint(newEndpoint.id);
  };

  const deleteEndpoint = (id: string) => {
    setSpec((prev) => ({
      ...prev,
      endpoints: prev.endpoints.filter((e) => e.id !== id),
    }));
    if (selectedEndpoint === id) {
      setSelectedEndpoint(null);
    }
  };

  const updateEndpoint = (id: string, updates: Partial<Endpoint>) => {
    setSpec((prev) => ({
      ...prev,
      endpoints: prev.endpoints.map((e) =>
        e.id === id ? { ...e, ...updates } : e
      ),
    }));
  };

  const addParameter = (endpointId: string) => {
    const newParam: Parameter = {
      name: "newParam",
      in: "query",
      description: "",
      required: false,
      schema: { type: "string" },
    };
    const endpoint = spec.endpoints.find((e) => e.id === endpointId);
    if (endpoint) {
      updateEndpoint(endpointId, {
        parameters: [...endpoint.parameters, newParam],
      });
    }
  };

  const exportSpec = (format: "json" | "yaml") => {
    const openAPISpec = {
      openapi: "3.0.0",
      info: spec.info,
      servers: spec.servers,
      paths: spec.endpoints.reduce((acc, endpoint) => {
        const path = endpoint.path;
        if (!acc[path]) acc[path] = {};

        acc[path][endpoint.method.toLowerCase()] = {
          summary: endpoint.summary,
          description: endpoint.description,
          tags: endpoint.tags,
          parameters: endpoint.parameters.map((p) => ({
            name: p.name,
            in: p.in,
            description: p.description,
            required: p.required,
            schema: p.schema,
          })),
          responses: endpoint.responses.reduce((respAcc, resp) => {
            respAcc[resp.code] = {
              description: resp.description,
              content: {
                [resp.contentType]: {
                  schema: {
                    type: "object",
                  },
                },
              },
            };
            return respAcc;
          }, {} as any),
        };

        return acc;
      }, {} as any),
    };

    const content =
      format === "json"
        ? JSON.stringify(openAPISpec, null, 2)
        : convertToYAML(openAPISpec);

    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `openapi.${format}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const convertToYAML = (obj: any, indent = 0): string => {
    let yaml = "";
    const spacing = "  ".repeat(indent);

    for (const [key, value] of Object.entries(obj)) {
      if (value === null || value === undefined) continue;

      if (typeof value === "object" && !Array.isArray(value)) {
        yaml += `${spacing}${key}:\n`;
        yaml += convertToYAML(value, indent + 1);
      } else if (Array.isArray(value)) {
        yaml += `${spacing}${key}:\n`;
        value.forEach((item) => {
          if (typeof item === "object") {
            yaml += `${spacing}  -\n`;
            yaml += convertToYAML(item, indent + 2);
          } else {
            yaml += `${spacing}  - ${item}\n`;
          }
        });
      } else {
        yaml += `${spacing}${key}: ${value}\n`;
      }
    }

    return yaml;
  };

  const selectedEndpointData = spec.endpoints.find(
    (e) => e.id === selectedEndpoint
  );

  const methodColors = {
    GET: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
    POST: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
    PUT: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
    DELETE: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
    PATCH: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold mb-2">OpenAPI Designer</h1>
              <p className="text-muted-foreground">
                Visual editor for creating OpenAPI 3.x specifications
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setViewMode(viewMode === "editor" ? "preview" : "editor")
                }
              >
                {viewMode === "editor" ? (
                  <>
                    <Eye className="w-4 h-4 mr-2" />
                    Preview
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-2" />
                    Editor
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportSpec("json")}
              >
                <FileJson className="w-4 h-4 mr-2" />
                Export JSON
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => exportSpec("yaml")}
              >
                <FileText className="w-4 h-4 mr-2" />
                Export YAML
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-green-500" />
            <span className="text-muted-foreground">
              Specification valid • {spec.endpoints.length} endpoints defined
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Panel - Structure */}
          <div className="lg:col-span-1 space-y-4">
            {/* API Info */}
            <Card>
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleSection("info")}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    API Information
                  </CardTitle>
                  {expandedSections.info ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </CardHeader>
              {expandedSections.info && (
                <CardContent className="space-y-3">
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      value={spec.info.title}
                      onChange={(e) =>
                        setSpec((prev) => ({
                          ...prev,
                          info: { ...prev.info, title: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="version">Version</Label>
                    <Input
                      id="version"
                      value={spec.info.version}
                      onChange={(e) =>
                        setSpec((prev) => ({
                          ...prev,
                          info: { ...prev.info, version: e.target.value },
                        }))
                      }
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={spec.info.description}
                      onChange={(e) =>
                        setSpec((prev) => ({
                          ...prev,
                          info: { ...prev.info, description: e.target.value },
                        }))
                      }
                    />
                  </div>
                </CardContent>
              )}
            </Card>

            {/* Endpoints List */}
            <Card>
              <CardHeader
                className="cursor-pointer"
                onClick={() => toggleSection("endpoints")}
              >
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Code2 className="w-4 h-4" />
                    Endpoints ({spec.endpoints.length})
                  </CardTitle>
                  {expandedSections.endpoints ? (
                    <ChevronDown className="w-4 h-4" />
                  ) : (
                    <ChevronRight className="w-4 h-4" />
                  )}
                </div>
              </CardHeader>
              {expandedSections.endpoints && (
                <CardContent className="space-y-2">
                  <Button
                    onClick={addEndpoint}
                    className="w-full"
                    size="sm"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Endpoint
                  </Button>
                  <div className="space-y-1">
                    {spec.endpoints.map((endpoint) => (
                      <div
                        key={endpoint.id}
                        className={`p-2 rounded-lg border cursor-pointer transition-colors ${
                          selectedEndpoint === endpoint.id
                            ? "border-violet-500 bg-violet-50 dark:bg-violet-900/20"
                            : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                        }`}
                        onClick={() => setSelectedEndpoint(endpoint.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={methodColors[endpoint.method]}>
                                {endpoint.method}
                              </Badge>
                            </div>
                            <div className="text-sm font-mono truncate">
                              {endpoint.path}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteEndpoint(endpoint.id);
                            }}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          </div>

          {/* Right Panel - Details */}
          <div className="lg:col-span-2">
            {selectedEndpointData ? (
              <Card>
                <CardHeader>
                  <CardTitle>Endpoint Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="general">
                    <TabsList className="mb-4">
                      <TabsTrigger value="general">General</TabsTrigger>
                      <TabsTrigger value="parameters">Parameters</TabsTrigger>
                      <TabsTrigger value="responses">Responses</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label>HTTP Method</Label>
                          <Select
                            value={selectedEndpointData.method}
                            onValueChange={(value: any) =>
                              updateEndpoint(selectedEndpoint!, {
                                method: value,
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="GET">GET</SelectItem>
                              <SelectItem value="POST">POST</SelectItem>
                              <SelectItem value="PUT">PUT</SelectItem>
                              <SelectItem value="DELETE">DELETE</SelectItem>
                              <SelectItem value="PATCH">PATCH</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Path</Label>
                          <Input
                            value={selectedEndpointData.path}
                            onChange={(e) =>
                              updateEndpoint(selectedEndpoint!, {
                                path: e.target.value,
                              })
                            }
                            placeholder="/api/resource"
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Summary</Label>
                        <Input
                          value={selectedEndpointData.summary}
                          onChange={(e) =>
                            updateEndpoint(selectedEndpoint!, {
                              summary: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Textarea
                          value={selectedEndpointData.description}
                          onChange={(e) =>
                            updateEndpoint(selectedEndpoint!, {
                              description: e.target.value,
                            })
                          }
                          rows={4}
                        />
                      </div>
                    </TabsContent>

                    <TabsContent value="parameters" className="space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">Parameters</h3>
                        <Button
                          size="sm"
                          onClick={() => addParameter(selectedEndpoint!)}
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Parameter
                        </Button>
                      </div>
                      {selectedEndpointData.parameters.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">
                          No parameters defined
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {selectedEndpointData.parameters.map((param, idx) => (
                            <Card key={idx}>
                              <CardContent className="pt-4">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <Label className="text-xs">Name</Label>
                                    <Input
                                      value={param.name}
                                      onChange={(e) => {
                                        const newParams = [
                                          ...selectedEndpointData.parameters,
                                        ];
                                        newParams[idx].name = e.target.value;
                                        updateEndpoint(selectedEndpoint!, {
                                          parameters: newParams,
                                        });
                                      }}
                                    />
                                  </div>
                                  <div>
                                    <Label className="text-xs">Location</Label>
                                    <Select
                                      value={param.in}
                                      onValueChange={(value: any) => {
                                        const newParams = [
                                          ...selectedEndpointData.parameters,
                                        ];
                                        newParams[idx].in = value;
                                        updateEndpoint(selectedEndpoint!, {
                                          parameters: newParams,
                                        });
                                      }}
                                    >
                                      <SelectTrigger>
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="query">Query</SelectItem>
                                        <SelectItem value="header">Header</SelectItem>
                                        <SelectItem value="path">Path</SelectItem>
                                        <SelectItem value="cookie">Cookie</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>

                    <TabsContent value="responses" className="space-y-4">
                      <h3 className="font-semibold">Responses</h3>
                      <div className="space-y-3">
                        {selectedEndpointData.responses.map((resp, idx) => (
                          <Card key={idx}>
                            <CardContent className="pt-4">
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <Label className="text-xs">Status Code</Label>
                                  <Input value={resp.code} readOnly />
                                </div>
                                <div>
                                  <Label className="text-xs">Content Type</Label>
                                  <Input value={resp.contentType} readOnly />
                                </div>
                              </div>
                              <div className="mt-3">
                                <Label className="text-xs">Description</Label>
                                <Input value={resp.description} readOnly />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="py-16">
                  <div className="text-center">
                    <Code2 className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">
                      No Endpoint Selected
                    </h3>
                    <p className="text-muted-foreground mb-4">
                      Select an endpoint from the list or create a new one to get
                      started
                    </p>
                    <Button onClick={addEndpoint}>
                      <Plus className="w-4 h-4 mr-2" />
                      Create First Endpoint
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
