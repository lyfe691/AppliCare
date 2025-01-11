import { ConfigProvider as AntConfigProvider, theme } from "antd";
import { useTheme } from "../context/theme/ThemeContext";

const { defaultAlgorithm, darkAlgorithm } = theme;

function AppConfigProvider({ children }) {
    const { effectiveTheme } = useTheme();
    const isDark = effectiveTheme === 'dark';

    // https://ant.design/docs/react/customize-theme
    return (
       
        <AntConfigProvider
            theme={{
                // antd dark and light mode
                algorithm: isDark ? darkAlgorithm : defaultAlgorithm,
                token: {
                    colorPrimary: '#94a3b8',
                    borderRadius: 9,
                    colorText: isDark ? '#ffffff' : '#2a2a2a',
                    colorTextSecondary: isDark ? '#e0e0e0' : '#4b5563',
                    colorTextTertiary: isDark ? '#a0a0a0' : '#6b7280',
                    colorBgContainer: isDark ? '#141414' : '#ffffff',
                    colorBgElevated: isDark ? '#1f1f1f' : '#ffffff',
                    colorBorder: isDark ? '#2a2a2a' : '#e5e7eb',
                    fontFamily: "'Montserrat', 'Roboto', sans-serif",
                },
                components: {
                    Menu: {
                        itemBg: 'transparent',
                        subMenuItemBg: 'transparent',
                        itemColor: isDark ? '#e0e0e0' : '#4b5563',
                        itemHoverColor: isDark ? '#ffffff' : '#2a2a2a',
                        itemSelectedColor: isDark ? '#ffffff' : '#2a2a2a',
                        itemHoverBg: isDark ? '#1f1f1f' : '#f3f4f6',
                        itemSelectedBg: isDark ? '#1f1f1f' : '#f3f4f6',
                    },
                    Input: {
                        colorBgContainer: isDark ? '#0a0a0a' : '#ffffff',
                        colorBorder: isDark ? '#2a2a2a' : '#d1d5db',
                        colorText: isDark ? '#ffffff' : '#2a2a2a',
                        colorTextPlaceholder: isDark ? '#a0a0a0' : '#9ca3af',
                    },
                    Select: {
                        colorBgContainer: isDark ? '#0a0a0a' : '#ffffff',
                        colorBorder: isDark ? '#2a2a2a' : '#d1d5db',
                        colorText: isDark ? '#ffffff' : '#2a2a2a',
                        colorTextPlaceholder: isDark ? '#a0a0a0' : '#9ca3af',
                        colorBgElevated: isDark ? '#141414' : '#ffffff',
                    },
                    Button: {
                        colorBgContainer: isDark ? '#1f1f1f' : '#ffffff',
                        colorBorder: isDark ? '#2a2a2a' : '#d1d5db',
                        colorText: isDark ? '#ffffff' : '#2a2a2a',
                    },
                    Modal: {
                        colorBgElevated: isDark ? '#141414' : '#ffffff',
                        colorBgMask: isDark ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.45)',
                    },
                    Card: {
                        colorBgContainer: isDark ? '#141414' : '#ffffff',
                        colorBorderSecondary: isDark ? '#2a2a2a' : '#e5e7eb',
                    },
                    Table: {
                        colorBgContainer: isDark ? '#141414' : '#ffffff',
                        colorText: isDark ? '#ffffff' : '#2a2a2a',
                        colorTextHeading: isDark ? '#ffffff' : '#2a2a2a',
                    },
                    Typography: {
                        colorText: isDark ? '#ffffff' : '#2a2a2a',
                        colorTextSecondary: isDark ? '#e0e0e0' : '#4b5563',
                        colorTextTertiary: isDark ? '#a0a0a0' : '#6b7280',
                    },
                    Dropdown: {
                        colorBgElevated: isDark ? '#141414' : '#ffffff',
                        colorText: isDark ? '#ffffff' : '#2a2a2a',
                        controlItemBgHover: isDark ? '#1f1f1f' : '#f3f4f6',
                        colorTextDescription: isDark ? '#e0e0e0' : '#4b5563',
                        menuItemSelectedBg: isDark ? '#1f1f1f' : '#f3f4f6',
                        colorBgTextHover: isDark ? '#1f1f1f' : '#f3f4f6',
                        colorBgTextActive: isDark ? '#1f1f1f' : '#f3f4f6',
                        itemColor: isDark ? '#ffffff' : '#2a2a2a',
                        itemHoverColor: isDark ? '#ffffff' : '#2a2a2a',
                        itemSelectedColor: isDark ? '#ffffff' : '#2a2a2a',
                    },
                    Statistic: {
                        colorText: isDark ? '#ffffff' : '#2a2a2a',
                        colorTextDescription: isDark ? '#e0e0e0' : '#4b5563',
                    },
                    Chart: {
                        colorText: isDark ? '#ffffff' : '#2a2a2a',
                        colorTextDescription: isDark ? '#e0e0e0' : '#4b5563',
                    }
                }
            }}
        >
            {children}
        </AntConfigProvider>
    );
}

export default AppConfigProvider;   