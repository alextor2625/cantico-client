import { createContext, useState } from "react"

const ErrorsContext = createContext()


const ErrorsProvider = ({children}) => {
    const [queueLimitError, setQueueLimitError] = useState(null)
  return (
    <ErrorsContext.Provider value={{queueLimitError, setQueueLimitError}}>
        {children}
    </ErrorsContext.Provider>
  )
}

export {ErrorsProvider, ErrorsContext};