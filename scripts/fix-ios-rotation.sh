#! /bin/bash
for file in "$@"
do
    jhead -autorot "$file"
done
