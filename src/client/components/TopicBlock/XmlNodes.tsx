import ExampleList from "$/client/components/ExampleList/ExampleList.jsx";
import Hanzi from "$/client/components/Hanzi/Hanzi.jsx";
import TranslationList from "$/client/components/TranslationList/TranslationList.jsx";
import { parseXml, type TagName, type XmlNode } from "$/client/utils/xml-parser.js";

export default function XmlNodes({ xml }: { xml: string; }) {
  return parseNodes(parseXml(xml));
}

function parseNodes(nodes: XmlNode[]) {
  return nodes.map(parseNode);
}

function parseNode(node: XmlNode): string | Node {
  if ("#text" in node)
    return node["#text"];

  const { ":@": attributes, ...element } = node;
  const tagName = Object.keys(element)[0] as TagName;
  const children = parseNodes(element[tagName]);

  switch (tagName) {
    case "page":
      return (<div className="page">{children}</div>);
    case "structure":
      return (<div className="structure">{children}</div>);
    case "main-trl":
      return (<div className="main-trl">{children}</div>);
    case "content":
      return (<div className="content">{children}</div>);
    case "example-list":
      return (<ExampleList>{children}</ExampleList>);
    case "example":
      return (<ExampleList.Example>{children}</ExampleList.Example>);
    case "hanzi":
      return (<Hanzi zh={attributes?.zh ?? ""} py={attributes?.py ?? ""} />);
    case "trl-list":
      return (<TranslationList>{children}</TranslationList>);
    case "trl":
      return (<span className="trl">{children}</span>);
    case "item":
      return (<span className="item">{children}</span>);
    default:
      const element = document.createElement(tagName) as HTMLElement;
      element.append(...children);
      Object.assign(element, attributes);
      return element;
  }
}