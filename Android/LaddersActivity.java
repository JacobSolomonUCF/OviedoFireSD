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
import android.support.v7.widget.AppCompatImageButton;
import android.util.Log;
import android.view.View;
import android.widget.Button;
import android.widget.ImageButton;
import android.widget.LinearLayout;
import android.widget.TableLayout;
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

public class LaddersActivity extends AppCompatActivity {

    private String uid;
    private String username;
    private String formId;
    private String offFormName;
    public static final String UID_SAVE = "UIDSaveFile";
    private URL url;
    private Activity activity;
    Context context;
    ArrayList<LinearLayout> buttons = new ArrayList();
    LinearLayout mLinearLayout;
    Resources res;
    TextView mTextView;
    boolean isTablet;
    TableLayout mTableLayout;
    AppCompatImageButton refreshButton;
    private Timer timer;
    private boolean timerFlag;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_ladders);
        mTableLayout=(TableLayout) findViewById(R.id.laddersTableLayout);
        //mTableLayout.isStretchAllColumns();
        //mTableLayout.isShrinkAllColumns();
        context = this;
        activity=this;
        res = getResources();
        timerFlag=true;
        isTablet=res.getBoolean(R.bool.isTablet);
        mLinearLayout = (LinearLayout) findViewById(R.id.laddersLinearLayout);
        TextView mUsernameTextView=(TextView) findViewById(R.id.laddersUsernameTextView);
        final SharedPreferences uidSave = getSharedPreferences(UID_SAVE, Context.MODE_PRIVATE);
        uid = uidSave.getString("pUID", null);
        username = uidSave.getString("pUsername", null);
        mUsernameTextView.setText(username);
        refreshButton=(AppCompatImageButton) findViewById(R.id.laddersRefreshButton);
        refreshButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                timerFlag=false;
                new LaddersActivity.RetrieveJSON().execute();
            }
        });
        new LaddersActivity.RetrieveJSON().execute();
    }

    class RetrieveJSON extends AsyncTask<Void, Void, String> {
        private ProgressDialog dialog = new ProgressDialog(LaddersActivity.this);
        protected void onPreExecute() {
            this.dialog.setMessage("LOADING");
            this.dialog.show();
        }
        protected String doInBackground(Void... urls) {
            /*if (!isNetworkAvailable()){
                Toast.makeText(LaddersActivity.this, "No Internet Connection",
                        Toast.LENGTH_SHORT).show();
                return null;
            }*/
            try {
                url = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/ladders/?uid="+uid);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                try {
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                    StringBuilder stringBuilder = new StringBuilder();
                    String line;
                    while ((line = bufferedReader.readLine()) != null) {
                        stringBuilder.append(line).append("\n");
                    }
                    bufferedReader.close();
                    System.out.println(stringBuilder.toString());
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
            buttons=OffJSONParser.offParse(response, mTableLayout, context, mLinearLayout, isTablet, res);
            for (int i=0; i<buttons.size(); i++){
                final int j=i;
                buttons.get(i).setOnClickListener(new View.OnClickListener() {
                    @Override
                    public void onClick(View v) {
                        formId=buttons.get(j).getTag().toString();
                        TextView bLeft=(TextView) buttons.get(j).getChildAt(0);
                        offFormName=bLeft.getText().toString();
                        new LaddersActivity.CompletionCheck().execute();
                    }
                });
            }
        }
    }
    class CompletionCheck extends AsyncTask <Void, Void, String>{
        private ProgressDialog dialog = new ProgressDialog(context);
        protected void onPreExecute() {
            this.dialog.setMessage("LOADING");
            this.dialog.show();
        }
        @Override
        protected String doInBackground(Void... params) {
            URL url;
            try {
                url = new URL("https://us-central1-oviedofiresd-55a71.cloudfunctions.net/checkCompletion/?uid="+uid+"&formId="+formId);
                HttpURLConnection urlConnection = (HttpURLConnection) url.openConnection();
                try {
                    BufferedReader bufferedReader = new BufferedReader(new InputStreamReader(urlConnection.getInputStream()));
                    StringBuilder stringBuilder = new StringBuilder();
                    String line;
                    while ((line = bufferedReader.readLine()) != null) {
                        stringBuilder.append(line).append("\n");
                    }
                    bufferedReader.close();
                    System.out.println(stringBuilder.toString());
                    return stringBuilder.toString();
                } finally {
                    urlConnection.disconnect();
                }
            }
            catch (Exception e){
                e.printStackTrace();
                return null;
            }
        }
        protected void onPostExecute(String response) {
            System.out.println(response.charAt(0));
            if(response.charAt(0)=='t'){
                System.out.println("read as true");
                timerFlag=false;
                Toast.makeText(LaddersActivity.this, "Form Already Completed: Loading completed form",
                        Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(context, ResultsActivity.class);
                intent.putExtra("FORM_ID", formId);
                startActivity(intent);
                //activity.finish();
            }
            else if (response.charAt(0)=='f'){
                System.out.println("read as false");
                timerFlag=false;
                Toast.makeText(LaddersActivity.this, "Loading form to complete",
                        Toast.LENGTH_SHORT).show();
                Intent intent = new Intent(context, FormActivity.class);
                intent.putExtra("FORM_ID", formId);
                intent.putExtra("EDIT", false);
                startActivity(intent);
                //activity.finish();
            }
            else{
                System.out.println("hell if I know");
                timerFlag=false;
                Toast.makeText(LaddersActivity.this, "Form already opened by someone else",
                        Toast.LENGTH_SHORT).show();
            }
            Log.i("INFO", response);
            if (dialog.isShowing())
                dialog.dismiss();
        }
    }
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
            Intent i = new Intent(LaddersActivity.this, MainActivity.class);
            i.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
            startActivity(i);
            finish();
        }
    }
}