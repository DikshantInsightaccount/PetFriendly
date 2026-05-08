$folders = @(
  "public",

  "src/api",
  "src/auth/guards",
  "src/routes",
  "src/layouts",

  "src/features/owners/pages",
  "src/features/owners/components",

  "src/features/pets/pages",
  "src/features/pets/components",

  "src/features/vets/pages",
  "src/features/vets/components",

  "src/features/visits/pages",
  "src/features/visits/components",

  "src/features/admin/pages",
  "src/features/admin/components",

  "src/features/chatbot/pages",
  "src/features/chatbot/components",

  "src/components/common",
  "src/components/layout",
  "src/components/data",

  "src/hooks",
  "src/utils",
  "src/styles",
  "src/pages"
)

$files = @(
  "src/api/axios.js",
  "src/api/interceptors.js",
  "src/api/endpoints.js",

  "src/auth/AuthContext.jsx",
  "src/auth/authService.js",
  "src/auth/guards/RequireAuth.jsx",
  "src/auth/guards/RequireRole.jsx",

  "src/routes/AppRoutes.jsx",
  "src/routes/routePaths.js",

  "src/layouts/PublicLayout.jsx",
  "src/layouts/UserLayout.jsx",
  "src/layouts/AdminLayout.jsx",

  "src/components/common/Button.jsx",
  "src/components/common/Modal.jsx",
  "src/components/common/Loader.jsx",

  "src/hooks/useAuth.js",

  "src/utils/constants.js",
  "src/utils/validators.js",
  "src/utils/date.js",

  "src/styles/global.css",

  "src/pages/Login.jsx",
  "src/pages/Register.jsx",
  "src/pages/Unauthorized.jsx",
  "src/pages/NotFound.jsx",

  "src/App.jsx",
  "src/main.jsx"
)

foreach ($folder in $folders) {
  if (!(Test-Path $folder)) {
    New-Item -ItemType Directory -Path $folder | Out-Null
  }
}

foreach ($file in $files) {
  if (!(Test-Path $file)) {
    New-Item -ItemType File -Path $file | Out-Null
  }
}

Write-Host "✅ Frontend folder structure created safely!"
