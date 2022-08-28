import { useReducer } from 'react';
import './styles.css';
import DigitButtons from './DigitButtons';
import OperationButtons from './OperationsButtons';

export const ACTIONS = {
  ADD_DIGIT: "add_digit",
  CHOOSE_OPERATION: "choose_operation",
  CLEAR: "clear",
  DELETE_DIGIT: "delete_digit",
  EVALUATE: "evaluate"
}

function reducer (state, {type, payload}) {
  switch(type) {
    case ACTIONS.ADD_DIGIT:
    if (state.overwrite) {
      return {
        ...state,
        currentOperand: payload.digit,
        overwrite: false,

      }

    }  
    if (payload.digit === "0" && state.currentOperand === "0") {
        return state
      }
    if (payload.digit === "," && state.currentOperand.includes(",")) {
        return state
      }
      
    return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      }
    
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
          return state
        }

      if (state.currentOperand == null) {
          return{
          ...state,
          operation: payload.operation
          }

        }

      if (state.previousOperand == null) {
          return {
            ...state,
            operation: payload.operation,
            previousOperand: state.currentOperand,
            currentOperand: null,

          }
        }

      return {
          ...state,
          previousOperand: evaluate(state),
          operation: payload.operation,
          currentOperand: null,

        }
      case ACTIONS.CLEAR:
        return {}

      case ACTIONS.DELETE_DIGIT:
      if (state.overwrite) {  
      return {
        ...state,
        overwrite:false,
        currentOperand: null
        }
      }
      if (state.currentOperand == null) return state
      if (state.currentOperand.length === 1) {
        return {...state, currentOperand: null}
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }

      case ACTIONS.EVALUATE:
        if (state.operation == null || state.currentOperand == null || state.previousOperand == null) {
          return state
        }

        return {
          ...state,
          previousOperand: null,
          overwrite: true,
          operation: null,
          currentOperand: evaluate(state),
        }
  }
}

function evaluate ({currentOperand, previousOperand, operation}) {
      const prev = parseFloat(previousOperand)
      const current = parseFloat(currentOperand)
      if (isNaN(prev) || isNaN(current)) return ""
      let computation = ""
      switch (operation) {
        case "+":
          computation = prev + current
          break
        case "-":
          computation = prev - current
          break
        case "*":
          computation = prev * current
          break
        case "÷":
          computation = prev / current
          break
      }
      
      return computation.toString()
}

const INTEGER_FORMATTER = new Intl.NumberFormat("it-IT", {maximumFractionDigits: 0, })

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split('.')
  if (decimal == null) return INTEGER_FORMATTER.format(integer)
  return `${INTEGER_FORMATTER.format(integer)},${decimal}`
}

function App() {
  const [ {currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {}) 

  
  return (
    <div className='calculator-grid'>
      <div className='output'>
        <div className='previous-operand'>{formatOperand(previousOperand)} {operation}</div>
        <div className='current-operand'>{formatOperand(currentOperand)}</div>
      </div>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.CLEAR})}>AC</button>
      <button onClick={() => dispatch({type: ACTIONS.DELETE_DIGIT})}>DEL</button>
      <OperationButtons operation="÷" dispatch={dispatch}/>
      <DigitButtons digit="1" dispatch={dispatch}/>
      <DigitButtons digit="2" dispatch={dispatch}/>
      <DigitButtons digit="3" dispatch={dispatch}/>
      <OperationButtons operation="*" dispatch={dispatch}/>
      <DigitButtons digit="4" dispatch={dispatch}/>
      <DigitButtons digit="5" dispatch={dispatch}/>
      <DigitButtons digit="6" dispatch={dispatch}/>
      <OperationButtons operation="+" dispatch={dispatch}/>
      <DigitButtons digit="7" dispatch={dispatch}/>
      <DigitButtons digit="8" dispatch={dispatch}/>
      <DigitButtons digit="9" dispatch={dispatch}/>
      <OperationButtons operation="-" dispatch={dispatch}/>
      <DigitButtons digit="." dispatch={dispatch}/>
      <DigitButtons digit="0" dispatch={dispatch}/>
      <button className='span-two' onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
    </div>
    
  );
}

export default App;
