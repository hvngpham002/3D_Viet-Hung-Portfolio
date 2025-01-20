/* eslint-disable @typescript-eslint/naming-convention */
import { useTranslation } from "react-i18next";

const About = () => {
  const { t } = useTranslation();

  return (
    <section className='max-container h-screen'>
      <h1 className='text-2xl dark:text-white'>
        {t("Hello, I'm")} <span className='blue-gradient_text font-semibold drop-shadow'>{t("Hung")}</span>
        <br />
        A Software Engineer from Vietnam
        </h1>
    </section>
  )
}

export default About;
