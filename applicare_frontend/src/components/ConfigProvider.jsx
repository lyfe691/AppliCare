import { ConfigProvider as AntConfigProvider } from "antd";


// https://ant.design/docs/react/customize-theme#basic-usage

function AppConfigProvider({ children }) {
    return (
        <AntConfigProvider
            theme={{
                token: {
                    colorPrimary: '#9FB9A1',  // changes all stuff with the type="primary"
                    borderRadius: 10,
                    colorText: '#2a2a2a',
                },
                components: {
                    Menu: {
                    }
                }
            }}
        >
            {children}
        </AntConfigProvider>
    );
}

export default AppConfigProvider;   