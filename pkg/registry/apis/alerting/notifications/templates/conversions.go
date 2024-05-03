package templates

import (
	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"

	templates "github.com/grafana/grafana/pkg/apis/alerting/notifications/templates/v0alpha1"
	"github.com/grafana/grafana/pkg/services/apiserver/endpoints/request"
	"github.com/grafana/grafana/pkg/services/ngalert/api/tooling/definitions"
)

func convertToK8sResources(orgID int64, list []definitions.NotificationTemplate, namespacer request.NamespaceMapper) (*templates.TemplateList, error) {
	result := &templates.TemplateList{}
	for _, t := range list {
		result.Items = append(result.Items, *convertToK8sResource(orgID, t, namespacer))
	}
	return result, nil
}

func convertToK8sResource(orgID int64, template definitions.NotificationTemplate, namespacer request.NamespaceMapper) *templates.Template {
	return &templates.Template{
		TypeMeta: templates.TemplateResourceInfo.TypeMeta(),
		ObjectMeta: metav1.ObjectMeta{
			Name:      template.Name,
			Namespace: namespacer(orgID),
			Annotations: map[string]string{ // TODO find a better place for provenance?
				"Provenance": string(template.Provenance),
			},
			// TODO ResourceVersion and CreationTimestamp
		},
		Spec: templates.TemplateSpec{Template: template.Template},
	}
}

func convertToDomainModel(template *templates.Template) definitions.NotificationTemplate {
	return definitions.NotificationTemplate{
		Name:       template.Name,
		Template:   template.Spec.Template,
		Provenance: "",
	}
}
