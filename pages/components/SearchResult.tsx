const Panel = (props: any) => {
  return (
    <div className="panel">
      <h1>{props.title}</h1>
      <div>{props.children}</div>
    </div>
  );
};

const Result = (props: any) => {
  return (
    <div className="result">
      <h2>{props.title}</h2>
      <div>{props.children}</div>
    </div>
  );
};


/* -------------------------------------------------------------------------- */
/*                             EXPORTED COMPONENT                             */
/* -------------------------------------------------------------------------- */
/**
 * Exports the SearchResult component.
 * 
 * The SearchResult component contains data on a search.
 */
export default function SearchResult(props: any) {
  return (
    <Panel title="Search Result">
      { props.results.length }
    </Panel>
  );
};
