// app/color-preview/page.tsx
export default function ColorPreview() {
    const colors = [
        { name: "Primary", variable: "--color-primary" },
        { name: "Secondary", variable: "--color-secondary" },
        { name: "Foreground", variable: "--color-foreground" },
        { name: "Background", variable: "--color-background" },
        { name: "Muted", variable: "--color-muted" },
        { name: "Border", variable: "--color-border" },
        { name: "Card", variable: "--color-card" },
        { name: "Accent", variable: "--color-accent" },
        { name: "Destructive", variable: "--color-destructive" },
        { name: "Success", variable: "--color-success" },
        { name: "Info", variable: "--color-info" },
    ];

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">LineUp Color Palette</h1>
            <table className="w-full text-left border-collapse">
                <thead>
                <tr className="border-b">
                    <th className="p-2">Variable</th>
                    <th className="p-2">Light</th>
                    <th className="p-2">Dark</th>
                    <th className="p-2">Usage</th>
                    <th className="p-2">Example</th>
                </tr>
                </thead>
                <tbody>
                {colors.map(({ name, variable }) => (
                    <tr key={name} className="border-b">
                        <td className="p-2 font-mono">{variable}</td>
                        <td className="p-2">
                            <div
                                className="w-6 h-6 rounded"
                                style={{ backgroundColor: `var(${variable})` }}
                            />
                        </td>
                        <td className="p-2">
                            <div
                                className="w-6 h-6 rounded dark:ring dark:ring-white"
                                style={{ backgroundColor: `var(${variable})` }}
                            />
                        </td>
                        <td className="p-2">{name}</td>
                        <td className="p-2">
                            <button
                                className="px-3 py-1 rounded text-white"
                                style={{ backgroundColor: `var(${variable})` }}
                            >
                                Button
                            </button>
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
