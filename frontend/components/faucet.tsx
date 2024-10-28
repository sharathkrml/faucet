"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { SERVER_URL } from "@/lib/constants"

export function Faucet() {
  const [address, setAddress] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [txHash, setTxHash] = useState("")
  const [balance, setBalance] = useState(0)
  const [faucetAddress, setFaucetAddress] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    const fetchFaucetAddress = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/account`)
        const data = await response.json()
        setFaucetAddress(data.account)
      } catch (error) {
        console.error("Failed to fetch faucet address:", error)
      }
    }
    fetchFaucetAddress()
    const fetchBalance = async () => {
      try {
        const response = await fetch(`${SERVER_URL}/balance`)
        const data = await response.json()
        // convert data.balance to ether
        const balance = data.balance / 10 ** 18
        setBalance(balance)
      } catch (error) {
        console.error("Failed to fetch balance:", error)
      }
    }

    fetchBalance()
    const interval = setInterval(fetchBalance, 5000)

    return () => clearInterval(interval)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError("")
    setTxHash("")

    try {
      const response = await fetch(`${SERVER_URL}/claim`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ account: address }),
      })

      if (!response.ok) {
        throw new Error("Failed to submit claim")
      }

      const data = await response.json()
      console.log(data)
      setTxHash(data.tx)
    } catch {
      setError("Failed to submit claim. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4 bg-gray-800 rounded-lg p-2">
        <p className="text-sm">Faucet Balance: {balance} ETH</p>
      </div>
      <div className="absolute top-4 left-4 bg-gray-800 rounded-lg p-2">
        <p className="text-sm">Address: {faucetAddress}</p>
      </div>
      <Card className="w-full max-w-md bg-gray-800 border-gray-700">
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center bg-gradient-to-r from-blue-400 to-purple-500 text-transparent bg-clip-text">Base Sepolia Faucet</CardTitle>
          <CardDescription className="text-center text-gray-400">Claim your Base Sepolia ETH</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input type="text" placeholder="Enter your wallet address" value={address} onChange={(e) => setAddress(e.target.value)} disabled={isSubmitting} className="bg-gray-700 border-gray-600 text-white placeholder-gray-400" />
            <Button type="submit" disabled={isSubmitting} className={`w-full bg-blue-500 hover:bg-blue-600 transition-all duration-300 ${isSubmitting ? "animate-pulse" : ""}`}>
              {isSubmitting ? "Submitting..." : "Claim ETH"}
            </Button>
          </form>
          {txHash && (
            <div className="mt-4 p-2 rounded bg-gray-800">
              <p className="text-sm">
                <span className="font-bold bg-gradient-to-r from-green-400 to-blue-500 text-transparent bg-clip-text">Transaction Hash:</span>
                <a href={`http://sepolia.basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="ml-2 text-blue-400 hover:underline">
                  {txHash.slice(0, 15)}...{txHash.slice(-15)}
                </a>
              </p>
            </div>
          )}
          {error && (
            <div className="mt-4 p-2 bg-red-800 rounded">
              <p className="text-sm">{error}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
