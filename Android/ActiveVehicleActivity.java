package comtelekpsi.github.oviedofireandroid;

import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.AsyncTask;
import android.support.v7.app.AppCompatActivity;
import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;

public class ActiveVehicleActivity extends AppCompatActivity {

    //type Submenu?
    Context context;
    static ArrayList mArrayList = new ArrayList();
    ArrayList<Button> buttons = new ArrayList();
    private LinearLayout mLinearLayout;
    ImageButton mImageButton;
    TextView mUserNameTextView;
    private String uid;
    private String username;
    public static final String UID_SAVE = "UIDSaveFile";
    private Uri uri;
    private URL url;
    private TextView mTextView;
    //ImageButton logoutButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_active_vehicle);
        mUserNameTextView=(TextView) findViewById(R.id.usernameTextView);
        mImageButton = (ImageButton) findViewById(R.id.logoutButton);
        SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        uid = uidSave.getString("pUID", null);
        Log.e("HEREHERE","Active successfully retried uid: "+uid);
        username = uidSave.getString("pUsername", null);
        Log.e("HEREHERE","Active successfully retried username: "+username);
        mUserNameTextView.setText(username);
        context = this;
        mLinearLayout=(LinearLayout)findViewById(R.id.linearLayout);
        String http="https://us-central1-oviedofiresd-55a71.cloudfunctions.net/activeVehicles/?uid="+uid;
        uri=Uri.parse(http);
        Log.e("HEREHERE","Active uri: " +uri.toString());
        mTextView=(TextView) findViewById(R.id.textView);
        try {
            new RetrieveJSON().execute();
        }
        catch (OutOfMemoryError error){
            Log.e("HEREHERE", "retrieveerror "+error.getMessage());
        }
    }

    class RetrieveJSON extends AsyncTask<Void, Void, String> {

        private Exception exception;
        private ProgressDialog dialog = new ProgressDialog(ActiveVehicleActivity.this);
        protected void onPreExecute() {
            this.dialog.setMessage("LOADING");
            this.dialog.show();
        }
        protected String doInBackground(Void... urls) {
            // Do some validation here
            try {
                url = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/activeVehicles/?uid="+uid);
                Log.e("HEREHERE","Active url being used: "+url.toString());
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                try {
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                    StringBuilder stringBuilder = new StringBuilder();
                    String line;
                    while ((line = bufferedReader.readLine()) != null) {
                        stringBuilder.append(line).append("\n");
                    }
                    bufferedReader.close();
                    Log.e("HEREHERE","Active stringbuilder: "+stringBuilder.toString());
                    return stringBuilder.toString();
                }
                finally{
                    urlConnection.disconnect();
                }
            }
            catch(Exception e) {
                Log.e("ERROR", e.getMessage(), e);
                return null;
            }
        }

        protected void onPostExecute(String response) {
            if(response == null) {
                response = "THERE WAS AN ERROR";
            }
            Log.i("INFO", response);
            if (dialog.isShowing()) {
                dialog.dismiss();
            }
            buttons.clear();
            try {
                buttons = ActiveJSONParser.parseparse(response, mLinearLayout, context);
                for (int i = 0; i < buttons.size(); i++) {
                    final int j = i;
                    try {
                        buttons.get(i).setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                Intent intent = new Intent(context, VehicleSubActivity.class);
                                intent.putExtra("VEHICLE_ID", buttons.get(j).getHint().toString());
                                intent.putExtra("VEHICLE_NAME", buttons.get(j).getText());
                                startActivity(intent);
                            }
                        });
                    }
                    catch (OutOfMemoryError error3){
                        Log.e("HEREHERE", "buttonclickerror " +error3.getMessage());
                    }
                }
            }
            catch (OutOfMemoryError error2){
                Log.e("HEREHERE", "buttonparseerror "+error2.getMessage());
            }
            //mTextView.setText(response);
        }
    }
    /*@Override
    protected void onResume(){
        super.onResume();
        mUserNameTextView=(TextView) findViewById(R.id.usernameTextView);
        SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        if(uid == null || uid.isEmpty()) {
            uid = uidSave.getString("pUID", null);
            username = uidSave.getString("pUsername", null);
        }
        mUserNameTextView.setText(username);
        mLinearLayout=(LinearLayout)findViewById(R.id.linearLayout);
    }*/
}
