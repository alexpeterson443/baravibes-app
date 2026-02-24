 param($m) $m.Value + "import AppAuth from `"./pages/AppAuth`";`r`n" function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/account"} component={Account} />
      <Route path={"/settings"} component={Settings} />
      <Route path={"/admin"} component={Admin} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
      <Route path="/app-auth" component={AppAuth} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <PreferencesProvider>
            <Toaster />
            <Router />
          </PreferencesProvider>
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

