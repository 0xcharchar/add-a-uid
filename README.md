# Add a UID to your ICS

Created out of frustation that Smart Contract Summit calendar files don't have UIDs and therefore can't be imported into ProtonCalendar

## Usage

I should probably wrap this up but:

1. Clone this project:
    ```sh
    git clone https://github.com/0xcharchar/add-a-uid
    cd add-a-uid
    ```
2. Make sure you have Node 14+, if you have NVM:
    ```sh
    nvm use
    ```
3. Install deps and all that:
    ```sh
    npm i
    ```
4. Finally, run it:
    ```sh
    # single calendar event
    ./index.js path/to/oof.ics
    
    # a folder of events (filters for *.ics)
    ./index.js path/to
    ```
    
## Test data

You can use the *example/* folder to test out the script, if you'd like
