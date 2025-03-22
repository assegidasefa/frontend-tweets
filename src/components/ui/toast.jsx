export function toast({ title, description, variant = "default" }) {
  // This is a simplified version - in a real app, this would use the ToastContext
  console.log({ title, description, variant })

  // Create a toast element
  const toastEl = document.createElement("div")
  toastEl.className = `fixed top-4 right-4 z-50 rounded-md border p-4 shadow-md ${
    variant === "destructive" ? "bg-red-100 border-red-400" : "bg-white border-gray-200"
  }`

  // Add content
  toastEl.innerHTML = `
    ${title ? `<div class="font-medium">${title}</div>` : ""}
    ${description ? `<div class="text-sm text-gray-500">${description}</div>` : ""}
  `

  // Add to DOM
  document.body.appendChild(toastEl)

  // Remove after timeout
  setTimeout(() => {
    toastEl.remove()
  }, 5000)
}

