import Trl from "$/components/Trl/Trl.tsx";
import Zh from "$/components/Zh/Zh.tsx";
import type { HighlightState, ZhmlExampleNode } from "$/types.ts";
import { useState } from "react";
import { NodeKinds } from "zhml";

export default function ExampleList({ nodes }: {
  nodes: ZhmlExampleNode[];
}) {

  return (
    <ul className="examples">
      {nodes.map(({ zh, trl }, i) => {
        const [highlightedId, setHighlightedId] = useState<number | null>(null);
        const state = { highlightedId, setHighlightedId };

        return (
          <li key={i}>
            <div className="example">
              <Example nodes={zh} state={state} />
            </div>
            <div className="trl">
              <Translation nodes={trl} state={state} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function Example({ nodes, state }: {
  nodes: ZhmlExampleNode["zh"];
  state: HighlightState;
}) {
  return nodes.map((node, i) => {
    switch (node.kind) {
      case NodeKinds.Text:
        return node.value;
      case NodeKinds.Zh:
        return (
          <Zh
            key={i}
            zh={node.zh}
            py={node.py}
            isHighlighted={state.highlightedId !== null && state.highlightedId === node.id}
            setHighlighted={(highlighted) => state.setHighlightedId(highlighted ? node.id : null)}
          />
        );
    }
  });
}

function Translation({ nodes, state }: {
  nodes: ZhmlExampleNode["trl"];
  state: HighlightState;
}) {
  return nodes.map((node, i) => {
    switch (node.kind) {
      case NodeKinds.Text:
        return node.value;
      case NodeKinds.TranslatedPhrase:
        return (
          <Trl
            key={i}
            value={node.value}
            isHighlighted={state.highlightedId !== null && state.highlightedId === node.id}
            setHighlighted={(highlighted) => state.setHighlightedId(highlighted ? node.id : null)}
          />
        );
    }
  });
}