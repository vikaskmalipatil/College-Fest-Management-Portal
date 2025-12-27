import "./globals.css";
import StudentNavbar from "@/components/StudentNavbar";


export const metadata = {
  title: "College Fest Portal",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        
        {children}
      </body>
    </html>
  );
}
