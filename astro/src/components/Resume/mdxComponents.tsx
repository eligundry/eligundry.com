export const experienceComponents = {
  ul: (props) => (
    <ul
      itemprop="description"
      class={`order-5 my-0 ${props.class ?? ''}`}
      {...props}
    />
  ),
  p: (props) => (
    <p
      itemprop="description"
      class={`order-5 my-2 ${props.class ?? ''}`}
      {...props}
    />
  ),
}

export const skillsComponents = {
  a: (props) => <a itemprop="knowsAbout" target="_blank" {...props} />,
}
