import React, { useState, useContext, useEffect, createContext } from 'react'
import { auth } from './firebase'
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth'

const authContext = createContext();


export function ProvideAuth({ children }){
  const [currentUser, setCurrentUser] = useState()
  const [isLoading, setIsLoading] = useState(true)

  const login = (email, password) => {
    return auth.signInWithEmailAndPassword(email,password)
  }

  const logout = () => {
    return auth.signOut()
  }

  {/*every time new auth, want to set Loading to false and user to current user-
    how we decide when to display dashboard*/}
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setCurrentUser(user)
      setIsLoading(false)
    })
    return unsubscribe
  }, [])


  const value = {
    currentUser,
    login,
    logout
  }

  return <authContext.Provider value = {value}>{!isLoading && children}</authContext.Provider>
}

export const useAuth = () => {
  return useContext(authContext)
}
