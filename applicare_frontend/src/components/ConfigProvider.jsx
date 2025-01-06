import { ConfigProvider as AntConfigProvider } from "antd";


// https://ant.design/docs/react/customize-theme#basic-usage

function AppConfigProvider({ children }) {
    return (
        <AntConfigProvider
            theme={{
                token: {
                    colorPrimary: '#9FB9A1',  // changes all stuff with the type="primary"
                    borderRadius: 9,
                    colorText: '#2a2a2a',
                    fontFamily: "'Montserrat', 'Roboto', sans-serif", // changes all text, remove if menu problems
                },
                components: {
                    Menu: {
                        // these are the colors for the menu items
                        horizontalItemSelectedColor: '#2a2a2a',
                        horizontalItemHoverColor: '#2a2a2a',
                        itemHoverColor: '#2a2a2a',
                        itemSelectedColor: '#2a2a2a',
                        itemBg: 'transparent',
                        horizontalItemBg: 'transparent',
                    
                    }
                }
            }}
        >
            {children}
        </AntConfigProvider>
    );
}

export default AppConfigProvider;   