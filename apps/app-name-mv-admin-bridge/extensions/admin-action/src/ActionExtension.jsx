import "@shopify/ui-extensions/preact";
import {render} from 'preact';
import {useEffect, useState} from 'preact/hooks';

const AI_AGENTS = {
  frank: {name: "Frank", avatar: "\u{1F916}", color: "#6C5CE7"},
  hermes: {name: "Hermes", avatar: "\u{26A1}", color: "#00B894"},
};

export default async () => {
  render(<Extension />, document.body);
};

function Extension() {
  const {i18n, close, data, extension: {target}} = shopify;
  const [productTitle, setProductTitle] = useState('');
  const [status, setStatus] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async function getProductInfo() {
      const getProductQuery = {
        query: `query Product($id: ID!) {
          product(id: $id) {
            title
          }
        }`,
        variables: {id: data.selected[0].id},
      };

      const res = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify(getProductQuery),
      });

      if (!res.ok) {
        console.error('Network error');
        return;
      }

      const productData = await res.json();
      setProductTitle(productData.data.product.title);
    })();
  }, [data.selected]);

  async function grantAccess(agent) {
    setLoading(true);
    const newStatus = {...status, [agent]: 'granting'};
    setStatus(newStatus);

    try {
      const metafieldsMutation = {
        query: `mutation SetMetafield($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields { id key value }
            userErrors { field message }
          }
        }`,
        variables: {
          metafields: [{
            ownerId: data.selected[0].id,
            namespace: "mv_admin_bridge",
            key: `${agent}_access`,
            type: "single_line_text_field",
            value: JSON.stringify({
              agent: AI_AGENTS[agent].name,
              access_level: "full",
              granted_at: new Date().toISOString(),
              scopes: "all",
              status: "active",
            }),
          }],
        },
      };

      const res = await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify(metafieldsMutation),
      });

      const result = await res.json();
      if (result.data?.metafieldsSet?.userErrors?.length) {
        setStatus({...status, [agent]: 'error'});
      } else {
        setStatus({...status, [agent]: 'active'});
      }
    } catch {
      setStatus({...status, [agent]: 'error'});
    }
    setLoading(false);
  }

  async function revokeAccess(agent) {
    setLoading(true);
    setStatus({...status, [agent]: 'revoking'});
    try {
      const deleteMutation = {
        query: `mutation DeleteMetafield($input: MetafieldDeleteInput!) {
          metafieldDelete(input: $input) { deletedId userErrors { field message } }
        }`,
        variables: {
          input: {
            ownerId: data.selected[0].id,
            namespace: "mv_admin_bridge",
            key: `${agent}_access`,
          },
        },
      };

      await fetch("shopify:admin/api/graphql.json", {
        method: "POST",
        body: JSON.stringify(deleteMutation),
      });

      setStatus({...status, [agent]: 'inactive'});
    } catch {
      setStatus({...status, [agent]: 'error'});
    }
    setLoading(false);
  }

  return (
    <s-admin-action>
      <s-stack direction="block" gap="400">
        <s-text type="strong">{i18n.translate('welcome', {target})}</s-text>
        <s-text>Current product: {productTitle}</s-text>
        <s-divider />
        <s-text type="strong">AI Agent Access Control</s-text>
        <s-text>Grant or revoke full admin access for Frank & Hermes</s-text>

        {Object.entries(AI_AGENTS).map(([key, agent]) => (
          <s-stack direction="row" gap="300" alignment="center" key={key}>
            <s-text>{agent.avatar} {agent.name}</s-text>
            {status[key] === 'active' ? (
              <s-button
                tone="critical"
                loading={loading && status[key] === 'revoking'}
                onClick={() => revokeAccess(key)}
              >
                Revoke Full Access
              </s-button>
            ) : (
              <s-button
                tone="primary"
                loading={loading && status[key] === 'granting'}
                onClick={() => grantAccess(key)}
              >
                Grant Full Access
              </s-button>
            )}
          </s-stack>
        ))}
      </s-stack>
      <s-button slot="primary-action" onClick={() => {
        console.log('saving');
        close();
      }}>Done</s-button>
      <s-button slot="secondary-actions" onClick={() => {
        console.log('closing');
        close();
      }}>Close</s-button>
    </s-admin-action>
  );
}
