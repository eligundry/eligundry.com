export const experienceComponents = {
  ul: (props: any) => (
    <ul
      itemprop="description"
      class={`order-5 my-0 ${props.class ?? ''}`}
      {...props}
    />
  ),
  p: (props: any) => (
    <p
      itemprop="description"
      class={`order-5 my-2 ${props.class ?? ''}`}
      {...props}
    />
  ),
}

export const skillsComponents = {
  a: (props: any) => <a itemprop="knowsAbout" target="_blank" {...props} />,
}
