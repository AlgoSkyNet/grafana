package template

import (
	"fmt"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime"
	"k8s.io/apiserver/pkg/registry/generic"
	genericregistry "k8s.io/apiserver/pkg/registry/generic/registry"
	"k8s.io/apiserver/pkg/registry/rest"

	notifications "github.com/grafana/grafana/pkg/apis/alerting/notifications/v0alpha1"

	grafanaregistry "github.com/grafana/grafana/pkg/apiserver/registry/generic"
	grafanarest "github.com/grafana/grafana/pkg/apiserver/rest"
	"github.com/grafana/grafana/pkg/services/apiserver/endpoints/request"
	"github.com/grafana/grafana/pkg/services/apiserver/utils"
)

func NewStorage(legacyService TemplateService, namespacer request.NamespaceMapper, scheme *runtime.Scheme, dualWrite bool, optsGetter generic.RESTOptionsGetter) (rest.Storage, error) {
	legacyStore := &legacyStorage{
		service:    legacyService,
		namespacer: namespacer,
		tableConverter: utils.NewTableConverter(
			resourceInfo.GroupResource(),
			[]metav1.TableColumnDefinition{
				{Name: "Name", Type: "string", Format: "name"},
			},
			func(obj any) ([]interface{}, error) {
				r, ok := obj.(*notifications.Template)
				if ok {
					return []interface{}{
						r.Name,
					}, nil
				}
				return nil, fmt.Errorf("expected resource or info")
			}),
	}
	if dualWrite && optsGetter != nil {
		strategy := grafanaregistry.NewStrategy(scheme)
		store := &genericregistry.Store{
			NewFunc:                   resourceInfo.NewFunc,
			NewListFunc:               resourceInfo.NewListFunc,
			PredicateFunc:             grafanaregistry.Matcher,
			DefaultQualifiedResource:  resourceInfo.GroupResource(),
			SingularQualifiedResource: resourceInfo.SingularGroupResource(),
			TableConvertor:            legacyStore.tableConverter,
			CreateStrategy:            strategy,
			UpdateStrategy:            strategy,
			DeleteStrategy:            strategy,
		}
		options := &generic.StoreOptions{RESTOptions: optsGetter, AttrFunc: grafanaregistry.GetAttrs}
		if err := store.CompleteWithOptions(options); err != nil {
			return nil, err
		}
		return grafanarest.NewDualWriter(legacyStore, store), nil
	}
	return legacyStore, nil
}
