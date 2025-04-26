import { simulateClickValidation } from "../utils/helper";

const solution = async (iframeDoc: Document) => {
  return await simulateClickValidation(iframeDoc, "button", "click");
};

const Two = () => {

    return (
      <div className="flex justify-center items-center">
          <h1 className="text-3xl font-semibold">Challenge 2: Make a button that changes <i>it's</i> text(to 'click') on click</h1>
      </div>
    )
  }
  
export { Two, solution }  