export default function Footer() {
  return (
    <footer className="border-top py-3 text-center text-muted bg-white">
      © {new Date().getFullYear()} PetClinic
    </footer>
  );
}