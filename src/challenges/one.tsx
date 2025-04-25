const solution = (iframeDoc: Document) => {
  const button = iframeDoc.querySelector("button");
  const text = button?.innerText
  return !!button && text === 'click';
};

const One = () => {
  return (
    <div className="flex justify-center items-center">
      <h1 className="text-3xl font-semibold">
        Challenge 1: Write a jsx that returns a button
      </h1>
    </div>
  );
};

export { One, solution };