Semantic data is becoming more and more important on the web, and, chances
are, you don't know how to use them. And I don't blame you! They're extremely
confusing and tedious if you don't know the history or purpose of them.

## A Bit Of History

I was first exposed to semantic data when I discovered
[Microformats](http://microformats.org/) back in 2009. At the time, I was a bit
obsessed with how Google weighted data and adding a couple attributes to
a series of elements to tell Google waht it was seemed magical. Also, I had (and
still do) have a bit of a man crush on [Eric Meyer](http://meyerweb.com/), so it
helped that he was an author on the spec.

<figure class="center">
	<img src="/assets/images/eric_meyer_man_crush.jpg" alt="Eric Meyer">
	<figcaption>Can I have your babies, Eric?</figcaption>
</figure>

Anyways, Microformats had a lot of good ideas. A great example of this is
[hCard](http://microformats.org/wiki/hcard), which is an HTML representation of
[vCard](http://en.wikipedia.org/wiki/VCard). In theory, you could tap a block of
HTML on your phone and add that person's contanct information to your phone's
contact list. Let's take a look:

```markup
<address class="vcard">
	<a class="url fn" href="http://eligundry.com">Eli Gundry</a>
	<span class="org">HacKSU</span>
	<span class="tel">
		<span class="type">Mobile</span>
		<span class="value">+13308286147</span>
	</span>
</address>
```

What made Microformats really unique is that it didn't add any attributes to
your HTML, opting instead to use specific classes to signify the important
markup. While this is easy, it actually makes it a bit harder for more complex
datatypes.

## Enter Microdata
