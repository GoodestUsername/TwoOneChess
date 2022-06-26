// components
import Document from "features/components/DocumentComponent";
import DocumentSection from "features/components/DocumentSection";

const AboutMePage = () => {
  return (
    <div className="AboutMePage">
      <Document 
        title={"About"} >
        <DocumentSection title={"Who am I?"} titleVariant={"h6"}>
          I'm Eric Dong, 
          {<br/>}
          I am a fresh graduate of BCIT in the Computer Systems Technology looking for a job!
          {<br/>}{<br/>}
          BCIT allowed me to work on multitudes of Languages, Frameworks, and Libraries such as react, nodejs, and express that allowed me to make this site!
          {<br/>}{<br/>}
          I also won the "BCIT Computer Systems Award in Technical Programming" {<a style={{color: "lightblue"}} href={"https://www.linkedin.com/posts/bcitcomputing_big-congratulations-to-some-of-our-amazing-activity-6920106584144494592-3vhu?utm_source=linkedin_share&utm_medium=member_desktop_web"}>link</a>}
          {<br/>}
          </DocumentSection>
          <DocumentSection title={"Contacts"} titleVariant={"h6"}>
          Contact me at: ericdongcannn@hotmail.com
          {<br/>}
          Github:&nbsp;{<a style={{color: "lightblue"}} href={"https://www.github.com/goodestUsername/"}>Github link</a>}
          {<br/>}
          Linkedin : {<a style={{color: "lightblue"}} href={"https://www.linkedin.com/in/eric-dong-0797611ab/"}>Linked link</a>}
          </DocumentSection>
      </Document>
    </div>
  );
}

export default AboutMePage;