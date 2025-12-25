export default function manifest() {
    return {
        name: 'Next Weather App',
        short_name: 'NextWeather',
        description: 'A beautiful and dynamic weather application',
        start_url: '/',
        display: 'standalone',
        background_color: '#111827',
        theme_color: '#111827',
        icons: [
            {
                src: '/logo.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
        ],
    }
}
