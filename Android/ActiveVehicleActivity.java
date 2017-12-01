package comtelekpsi.github.oviedofireandroid;

import android.app.Activity;
import android.app.ProgressDialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.res.Resources;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;
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
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.Timer;
import java.util.TimerTask;

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
    boolean isTablet;
    public static final String UID_SAVE = "UIDSaveFile";
    private Uri uri;
    private URL url;
    private TextView mTextView;
    private Timer timer;
    private boolean timerFlag;
    //ImageButton logoutButton;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_active_vehicle);
        mUserNameTextView=(TextView) findViewById(R.id.usernameTextView);
        mImageButton = (ImageButton) findViewById(R.id.logoutButton);
        Resources res = getResources();
        timerFlag=true;
        isTablet=res.getBoolean(R.bool.isTablet);
        final SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        uid = uidSave.getString("pUID", null);
        Log.e("HEREHERE","Active successfully retried uid: "+uid);
        username = uidSave.getString("pUsername", null);
        Log.e("HEREHERE","Active successfully retried username: "+username);
        mUserNameTextView.setText(username);
        context = this;
        mLinearLayout=(LinearLayout)findViewById(R.id.llActive);
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
            /*if (!isNetworkAvailable()){
                Toast.makeText(ActiveVehicleActivity.this, "No Internet Connection",
                        Toast.LENGTH_SHORT).show();
                return null;
            }*/
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
                buttons = ActiveJSONParser.parseparse(response, mLinearLayout, context, isTablet);
                for (int i = 0; i < buttons.size(); i++) {
                    final int j = i;
                    try {
                        buttons.get(i).setOnClickListener(new View.OnClickListener() {
                            @Override
                            public void onClick(View v) {
                                timerFlag=false;
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
    public boolean isNetworkAvailable() {
        ConnectivityManager manager = (ConnectivityManager) getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo networkInfo = manager.getActiveNetworkInfo();

        boolean isAvailable = false;
        if (networkInfo != null && networkInfo.isConnected()) {
            isAvailable = true;
        }
        return isAvailable;
    }

    @Override
    protected void onPause() {
        super.onPause();
        if(timerFlag) {
            timer = new Timer();
            Log.i("Main", "Invoking logout timer");
            LogOutTimerTask logoutTimeTask = new LogOutTimerTask();
            timer.schedule(logoutTimeTask, 10800000); //auto logout in 180 minutes
        }
    }

    @Override
    protected void onResume() {
        super.onResume();
        timerFlag=true;
        if (timer != null) {
            timer.cancel();
            Log.i("Main", "cancel timer");
            timer = null;
        }
    }

    private class LogOutTimerTask extends TimerTask {

        @Override
        public void run() {

            //logout
            final SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
            FirebaseAuth.getInstance().signOut();
            SharedPreferences.Editor editor = uidSave.edit();
            editor.clear();
            editor.commit();

            //redirect user to login screen
            Intent i = new Intent(ActiveVehicleActivity.this, MainActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
            finish();
        }
    }
}
