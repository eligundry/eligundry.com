#![feature(decl_macro, proc_macro_hygiene)]

#[macro_use] extern crate rocket;

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

fn main() {
    rocket::ignite().mount("/rust-api", routes![index]).launch();
}
