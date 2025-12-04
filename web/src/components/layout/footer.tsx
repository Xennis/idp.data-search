export const Footer = () => {
  return (
    <footer className="mx-4 mt-20 mb-8 border-t pt-4">
      <div className="text-sm text-gray-600">
        The data is from the project{" "}
        <a className="underline hover:no-underline" href="https://github.com/papyri/idp.data" target="_blank">
          idp.data
        </a>{" "}
        by{" "}
        <a className="underline hover:no-underline" href="http://papyri.info" target="_blank">
          Papyri.info
        </a>
        . This data is made available under a{" "}
        <a className="underline hover:no-underline" href="https://creativecommons.org/licenses/by/3.0/" target="_blank">
          Creative Commons Attribution 3.0 License
        </a>
        , with copyright and attribution to the respective projects.
      </div>
    </footer>
  )
}
