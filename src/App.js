import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { persistor, store } from './modules/store/store';
import { PersistGate } from 'redux-persist/integration/react';
import { Provider } from 'react-redux';
import { routes } from './common/constant/routes-contants';

function App() {
    return (
        <div className="App">
            <Provider store={store}>
                <PersistGate loading={<p>loading.....</p>} persistor={persistor}>
                    <BrowserRouter basename='/'>
                        <Routes basename>
                            {routes.map((route) => (
                                <Route
                                    key={route.key}
                                    path={route.path}
                                    element={route.element}
                                    authNeeded={route.authNeeded}
                                >
                                    {route.children.map((child) => (
                                        <Route
                                            key={child.key}
                                            path={child.path}
                                            element={child.element}
                                            authNeeded={child.authNeeded}
                                        >
                                            {child.children.map((item) => (
                                                <Route
                                                    key={item.key}
                                                    path={item.path}
                                                    element={item.element}
                                                    authNeeded={item.authNeeded}
                                                >
                                                </Route>
                                            ))}
                                        </Route>
                                    ))}
                                </Route>
                            ))}
                            <Route path="*" element={<Navigate to="/" />} />
                        </Routes>
                    </BrowserRouter>
                </PersistGate>
            </Provider>
        </div>
    );
}

export default App;
