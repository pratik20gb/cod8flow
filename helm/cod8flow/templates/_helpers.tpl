{{- define "cod8flow.name" -}}
{{- .Chart.Name }}
{{- end }}

{{- define "cod8flow.fullname" -}}
{{- printf "%s-%s" .Release.Name .Chart.Name | trunc 63 | trimSuffix "-" }}
{{- end }}

{{- define "cod8flow.labels" -}}
app.kubernetes.io/name: {{ include "cod8flow.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
helm.sh/chart: {{ .Chart.Name }}-{{ .Chart.Version }}
{{- end }}

{{- define "cod8flow.selectorLabels" -}}
app.kubernetes.io/name: {{ include "cod8flow.name" . }}
app.kubernetes.io/instance: {{ .Release.Name }}
{{- end }}
